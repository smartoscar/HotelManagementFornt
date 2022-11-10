// 定义操作管理员API函数--围绕后台实现增删改查

// 导入请求函数
import { $get, $post, $setToken } from '../utils/request.js'
// 导入js-md5
import md5 from 'js-md5'
// 导入消息框
import { $msg_s, $msg_w, $msg_e } from '../utils/msg.js'

export let login = async(params) => {
    // 结构出记住我
    let { ckMe } = params
    // 对密码进行加密
    params.password = md5(params.password + params.username);
    // 登陆成功后，服务器会向前台返回一个token
    // token是唯一凭证：令牌，之后向服务器左的每一次提交，都要带上这个令牌。
    let { status, msg, data } = await $get('Admin/login', params);
    if (status == 0) {
        // 浏览器缓存有两种，sessionStorage 和 localStorage
        // sessionStorage，随着浏览器的关闭而清空
        // localStorage，除非手动清除，否则会一直缓存在浏览器中
        sessionStorage.setItem('token', data.token);

        // 将token信息设置为请求头内容
        $setToken()
        $msg_s(msg);
        // 登录成功后，缓存账号
        localStorage.setItem('username', params.username);

        // 判断是否需要记住我
        if (ckMe) {
            localStorage.setItem('password', params.password)
        }
        return { success: true, userPermission: data.userPermission }
    } else {
        $msg_w(msg)
        return { success: false, userPermission: '' }
    }
}

// 记住我自动登录
export let loginAuto = async() => {
    // 从浏览器缓存中获取
    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')
    if (username && password) {
        let params = {
            username,
            password
        }
        let { status, data } = await $get('Admin/login', params);
        if (status == 0) {
            sessionStorage.setItem('token', data);
            // 将token信息设置为请求头内容
            $setToken()
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

// 公用post方法
let $_post = async(url, params) => {
    let data = await $post(url, params)
    data.status == 0 ? $msg_s(data.msg) : $msg_e(data.msg)
    return data.status == 0
}

//表单校验公共方法
let checkInput = (params, isAdd) => {
    if (isAdd && !params.username) {
        $msg_e("用户名不能为空")
        return false
    } else if (isAdd && !params.password) {
        $msg_e("密码不能为空")
        return false
    } else if (isAdd && !params.password && params.password != params.confirmPassword) {
        $msg_e("两次密码不一致")
        return false
    }
    return true
}

// 查询用户列表
export let getAllUsers = async() => {
    let r = await $get('Admin/list')
    return r
}

// 条件查询用户列表
export let pageUsers = async(params) => {
    let r = await $get('Admin/page', params)
    return r
}

// 增加用户
export let userAdd = async(params) => {
    params.password = md5(params.password + params.username);
    // 表单校验
    if (!checkInput(params, true)) {
        return false
    }
    // 发送请求
    let r = await $_post('Admin/add', params)
    return r
}

// 修改用户
export let userEdit = async(params) => {
    // 表单校验
    if (!checkInput(params)) {
        return false
    }
    // 发送请求
    let r = await $_post('Admin/edit', params)
    return r
}

// 删除用户
export let userDelete = async(id) => {
    // 发送请求
    let r = await $_post('Admin/delete/' + id)
    return r
}

// 查询单个用户
export let getUser = async(params) => {
    // 发送请求
    let r = await $get('Admin/getUser', params)
    return r
}

// 修改密码
export let resetPassword = async(params) => {
    if (!params.oldPassword) {
        $msg_e('请输入旧密码')
        return false
    } else if (!params.newPassword) {
        $msg_e('请输入新密码')
        return false
    } else if (!params.confirmPassword) {
        $msg_e('请输入确认密码')
        return false
    } else if (params.newPassword != params.confirmPassword) {
        $msg_e('输入的两次密码不一致')
        return false
    }
    params.oldPassword = md5(params.oldPassword + params.username);
    params.newPassword = md5(params.newPassword + params.username);
    // 发送请求
    let r = await $post('Admin/resetPassword', params)
    if (r.status == 0) {
        $msg_s(r.msg)
    } else {
        $msg_s(r.msg)
    }

    return r.status == 0
}