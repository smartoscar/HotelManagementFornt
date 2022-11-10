// 导入请求函数
import { $get, $post } from "@/utils/request"
// 导入消息框
import { $msg_s, $msg_e, $confirm } from '../utils/msg.js'

// 查询
export let listRoomOrder = async(params) => {
    let r = await $post('RoomOrder/list', params)
    return r
}

// 添加
export let addRoomOrder = async(params) => {
    if (!checkInput(params)) {
        return false
    }
    let r = await $post('RoomOrder/add', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 修改
export let editRoomOrder = async(params) => {
    if (!checkInput(params)) {
        return false
    }
    let r = await $post('RoomOrder/edit', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 处理订单
export let processRoomOrder = async(params) => {
    let r = await $post('RoomOrder/process', params)
    r.status == 0 ? $msg_s(r.msg) : $msg_e(r.msg)
    return r.status == 0
}

// 表单校验
let checkInput = (params) => {
    if (!params.phone || params.phone == '') {
        $msg_e('顾客电话不能为空')
        return false
    } else if (!params.identifyType || params.identifyType == '' || params.identifyType == 0) {
        $msg_e('请选择顾客证件类型')
        return false
    } else if (!params.identifyId || params.identifyId == '') {
        $msg_e('顾客证件号码不能为空')
        return false
    } else if (!params.roomCode || params.roomCode == '') {
        $msg_e('房号不能为空')
        return false
    } else if (!params.deposit || params.deposit == '') {
        $msg_e('押金不能为空')
        return false
    } else if (!params.startDate || params.startDate == '') {
        $msg_e('入住日期不能为空')
        return false
    } else if (!params.endDate || params.endDate == '') {
        $msg_e('退房日期不能为空')
        return false
    } else if (!params.amount || params.amount == '') {
        $msg_e('总价不能为空')
        return false
    }
    return true
}