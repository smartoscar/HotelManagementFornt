// 封装消息看
// 导入消息框
import { ElMessage, ElMessageBox } from "element-plus";

// 成功的消息框
export let $msg_s = (val, duration = 2000) => {
    ElMessage({
        showClose: true,
        message: val,
        type: 'success',
        duration: duration,
    })
}

// 警告的消息框
export let $msg_w = (val, duration = 2000) => {
    ElMessage({
        showClose: true,
        message: val,
        type: 'warning',
        duration: duration,
    })
}

// 错误的消息框
export let $msg_e = (val, duration = 2000) => {
    ElMessage({
        showClose: true,
        message: val,
        type: 'error',
        duration: duration,
    })
}

// 确认框
export let $confirm = (message) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            message,
            '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            resolve()
        }).catch(() => {})
    })

}