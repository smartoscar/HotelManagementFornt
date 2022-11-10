// 输出YYYY-MM-DD HH:mm:ss日期时间格式
export let dateTimeFormat = (time) => {
    let date = new Date(time)
    let y = date.getFullYear()
    let m = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
    let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    let sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return `${y}-${m}-${d} ${hour}:${min}:${sec}`
}