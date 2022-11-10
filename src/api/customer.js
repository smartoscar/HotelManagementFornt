import { $get, $post } from '../utils/request'
import { $msg_s, $msg_e } from '../utils/msg'

// 根据ID查询单个顾客信息
export let oneCustomer = async(id) => {
    let r = await $get('Customer/one/' + id)
    return r
}