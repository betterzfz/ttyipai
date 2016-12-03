/**
 * a frequently used javascript functions library
 * @stone
 */

/**
 * a separated countdown function
 * @param countdown_time the seconds to countdown
 * @param second_id the id of the seconds element for countdown
 * @param minute_id the id of ths minutes element for countdown
 * @param hour_id the id of the hours element for countdown
 * @param day_id the id of the days element for countdown
 * return timeoutID a numeric, non-zero value which identifies the timer created by the call to setInterval()
 * @stone
 */
const separated_countdown = (countdown_time, second_id, minute_id, hour_id, day_id, callback) => {
    let countdown_interval = setInterval(() => {
        if (countdown_time > 0) {
            const days = Math.floor(countdown_time / 86400);
            const hours = Math.floor(countdown_time / 3600 - days * 24);
            const minutes = Math.floor(countdown_time / 60 - days * 1440 - hours * 60);
            if (second_id) {
                document.getElementById(second_id).innerHTML = Math.floor(countdown_time) - days * 86400 - hours * 3600 - minutes * 60;
            }
            if (minute_id) {
                document.getElementById(minute_id).innerHTML = minutes;
            }
            if (hour_id) {
                document.getElementById(hour_id).innerHTML = hours;
            }
            if (day_id) {
                document.getElementById(day_id).innerHTML = days;
            }
            countdown_time--;
        } else {
            if (callback) {
                callback();
            }
            clearInterval(countdown_interval);
        }
    }, 1000);
    return countdown_interval;
}

/**
 * a joined countdown function
 * @param countdown_time the seconds to countdown
 * @param countdown_id the id of the element for countdown
 * @param language the language for countdown to show
 * @param title the text decorated for countdown
 * @param callback the callback function for countdown
 * return timeoutID a numeric, non-zero value which identifies the timer created by the call to setInterval()
 * @stone
 */
const joined_countdown = (countdown_time, countdown_id, language, title, callback) => {
    let countdown_interval = setInterval(() => {
        if (countdown_time > 0) {
            const days = Math.floor(countdown_time / 86400);
            const hours = Math.floor(countdown_time / 3600 - days * 24);
            const minutes = Math.floor(countdown_time / 60 - days * 1440 - hours * 60);
            const seconds = Math.floor(countdown_time) - days * 86400 - hours * 3600 - minutes * 60;

            let day_label = ':';
            let hour_label = ':';
            let minute_label = ':';
            let second_label = '';
            switch (language) {
                case 'en':
                    day_label = 'days';
                    hour_label = 'hours';
                    minute_label = 'minutes';
                    second_label = 'seconds';
                    break;
                case 'zh-cn':
                    day_label = '天';
                    hour_label = '时';
                    minute_label = '分';
                    second_label = '秒';
                    break;
            }

            let countdown_info = '';
            if (days > 0) {
                countdown_info += days + day_label;
            }
            if (hours > 0) {
                countdown_info += hours + hour_label;
            }
            if (minutes > 0) {
                countdown_info += minutes + minute_label;
            }
            if (seconds > 0) {
                countdown_info += seconds + second_label;
            }
            document.getElementById(countdown_id).innerHTML = title + countdown_info;

            countdown_time--;
        } else {
            if (callback) {
                callback();
            }
            clearInterval(countdown_interval);
        }
    }, 1000);
    return countdown_interval;
}

/**
 * a function to generate a random string
 * @param length the length of the random string
 * @param flag
 * 1-get only lower-case letters string,
 * 2-get only capital letters string,
 * 3-get only letter string, 
 * 4-get numeric string,
 * 5-get a string is made up of lower-case letters and numbers,
 * 6-get a string is made up of capital letters and numbers,
 * otherwise you will get a string is made up of case letters and numbers
 * @stone
 */
const get_random_string = (length, flag) => {
    const lower_case_letters = 'abcdefghijklmnopqrstuvwxyz';
    const capital_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let candidate_characters = '';
    switch (flag) {
        case 1:
            candidate_characters = lower_case_letters;
            break;
        case 2:
            candidate_characters = capital_letters;
            break;
        case 3:
            candidate_characters = lower_case_letters+capital_letters;
            break;
        case 4:
            candidate_characters = numbers;
            break;
        case 5:
            candidate_characters = lower_case_letters+numbers;
            break;
        case 6:
            candidate_characters = capital_letters+numbers;
            break;
        default:
            candidate_characters = lower_case_letters+capital_letters+numbers;
            break;
    }

    let result_string = '';
    for (let i = 0;i < length;i++) {
        result_string += candidate_characters.charAt(Math.floor(Math.random() * candidate_characters.length));
    }

    return result_string;
}