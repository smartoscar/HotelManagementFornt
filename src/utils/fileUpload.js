// 文件上传工具

import { $msg_e } from './msg'
// 文件上传之前
export let $beforeUpload = (file) => {
    let imgTypes = ['image/jpg', 'image/gif', 'image/jpeg', 'image/png']
    let isImage = imgTypes.includes(file.type)
    let isLt2M = file.size / 1024 / 1024 < 2
    if (!isImage) {
        $msg_e('图片格式不正确!')
    }
    if (!isLt2M) {
        $msg_e('图片大小不能超过2M!')
    }
    return isImage && isLt2M
}