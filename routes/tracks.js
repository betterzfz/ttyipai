const express = require('express');
const mysql = require('mysql');
const moment = require('moment');

const router = express.Router();

const config_info = {
  interactive_domain : 'http://www.ttyipai.com/',
  org_domain : 'http://cdn.ttyipai.com'
};
const user_id = 1;
const open_id = 146;

let info_data = {
  title : '专场信息',
  key_content : '专场信息',
  description_content : '专场信息',
  config_info : config_info
};

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'qnrp'
});

/* GET track info page. */
router.get('/info/:uid/:special_id', (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    const query_info_sql = `
      SELECT
        MySpecial.name AS special_name,
        MySpecial.contact,
        MySpecial.shooting_time,
        MySpecial.tv_status,
        MySpecial.tv_type,
        MySpecial.s_url,
        MySpecial.desc,
        MySpecial.service_provision,
        MySpecialPicData.org AS special_org,
        MyAuction.id,
        MyAuction.name AS auction_name,
        MyAuction.no,
        MyAuction.starting_price,
        MyAuction.reserve_price,
        MyAuction.bond,
        MyAuction.start_time,
        MyAuction.end_time,
        MyAuctionPicData.org AS auction_org,
        MyJpGoodsFollow.follow AS auction_follow,
        MyJpOrder.id AS order_id
      FROM
        my_special AS MySpecial
      JOIN
        my_pic_data AS MySpecialPicData
      ON
        MySpecial.picid = MySpecialPicData.id
      LEFT JOIN
        my_auction AS MyAuction
      ON
        MySpecial.id = MyAuction.specialid
      JOIN
        my_pic_data AS MyAuctionPicData
      ON
        MyAuction.auctioncoverid = MyAuctionPicData.id
      LEFT JOIN
        my_jp_goods_follow AS MyJpGoodsFollow
      ON
        MyAuction.id = MyJpGoodsFollow.goodsid AND MyJpGoodsFollow.openid = ` + open_id + `
      LEFT JOIN
        my_jp_order AS MyJpOrder
      ON
        MyAuction.id = MyJpOrder.auctionid AND MyJpOrder.openid = ` + open_id + ` AND MyJpOrder.payment_status = 1 AND MyJpOrder.status = 1
      WHERE
        MySpecial.id = ` + req.params.special_id + `
      AND
        MySpecial.status = 1
      ORDER BY
        MyAuction.no ASC`;

    connection.query(query_info_sql, (err, rows, fields) => {
      if (err) throw err;
      const shooting_time = moment.unix(rows[0].shooting_time);
      let special_info = {
        id : req.params.special_id,
        name : rows[0].special_name,
        contact : rows[0].contact,
        shooting_date : shooting_time.format('YYYY.MM.DD'),
        shooting_week : shooting_time.day(),
        shooting_time : shooting_time.format('HH:mm:ss'),
        tv_status : rows[0].tv_status,
        tv_type : rows[0].tv_type,
        s_url : rows[0].s_url,
        desc : rows[0].desc,
        service_provision : rows[0].service_provision,
        org : rows[0].special_org,
        auction_list : new Array()
      };
      
      for (let index in rows) {
        let count_down_info = {'is_start' : 0};
        if (rows[index].start_time) {
          count_down_info.is_start = 1;
          count_down_info.end_time = rows[index].end_time;
        } else {
          if (index == 0) {
            count_down_info.start_time = rows[index].shooting_time;
          }
        }
        special_info.auction_list.push({
          id : rows[index].id,
          name : rows[index].auction_name,
          no : rows[index].no,
          starting_price : rows[index].starting_price,
          reserve_price : rows[index].reserve_price,
          bond : rows[index].bond,
          count_down_info : count_down_info,
          org : rows[index].auction_org,
          attention : rows[index].auction_follow,
          order_id : rows[index].order_id
        });
      }
      info_data.special_info = special_info;

      const query_fan_sql = 'SELECT status as fan_status FROM my_user_fans AS MyUserFans where id = ' + open_id;
      connection.query(query_fan_sql, (err, rows, fields) => {
        info_data.fan_info = {user_id : user_id, open_id : open_id, status : rows[0].fan_status};
        connection.release();
        res.render('tracks/info', info_data);
      });
    });
  });  
});

/* POST set_attention. */
router.post('/set_attention', (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    let result_data = {'code' : -1, 'data' : {'follow' : 1}};
    const query_attention_sql = 'SELECT id, follow FROM my_jp_goods_follow WHERE goodsid = ' + req.body.auction_id + ' AND openid = ' + open_id + ' AND from_type = 0';
    connection.query(query_attention_sql, (err, rows, fields) => {
      if (rows && rows.length) {
        let this_follow = 0;
        if (rows[0].follow == 0) {
          this_follow = 1;
        }
        const update_attention_sql = 'UPDATE my_jp_goods_follow SET follow = ' + this_follow + ' WHERE id = ' + rows[0].id;
        connection.query(update_attention_sql, (err, results) => {
          if (err) throw err;
          connection.release();
          if (results) {
            result_data.code = 0;
            result_data.data = {'follow' : this_follow};
          }
          res.json(result_data);
        });
      } else {
        const now_time = Math.floor(Date.now()/1000);
        const insert_attention_sql = 'INSERT INTO my_jp_goods_follow(userid, openid, specialid, follow, goodsid, cdate, udate) VALUES(' + user_id + ', ' + open_id + ', ' + req.body.special_id + ', 1, ' + req.body.auction_id + ', \'' + now_time + '\', \'' + now_time + '\')';
        connection.query(insert_attention_sql, (err, results) => {
          if (err) throw err;
          connection.release();
          if (results) {
            result_data.code = 0;
          }
          res.json(result_data);
        });
      }
    });
  });
});

/* POST start_track. */
router.post('/start_track', (req, res, next) => {
  const 
});

module.exports = router;