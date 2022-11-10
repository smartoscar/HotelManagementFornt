// 开发模式
let model = {
    // 开发阶段接口地址
    // dev: '/api',
    dev: 'http://localhost/',
    // 测试阶段接口地址
    test: 'http://localhost/',
    // 测试阶段接口地址
    prd: 'http://localhost/',
}

// 定义请求根路径， 根据当前的开发阶段，返回对应的接口地址
export const BASE_URL = model.dev

// 文件上传url
export const ADMIN_UPLOAD_URL = BASE_URL + 'fileTrans/uploadFile'
    // 文件服务器地址
export const FILE_SERVER_URL = 'http://192.168.2.134:8888/'

export const $defaultValues = {
    PAGE: {
        PAGE_SIZES: [1, 2, 5, 10]
    }
}

// 客房状态
export const ROOM_STATUS = [
    { roomStatus: 0, roomStatusName: '请选择' },
    { roomStatus: 1, roomStatusName: '空闲' },
    { roomStatus: 2, roomStatusName: '预定' },
    { roomStatus: 3, roomStatusName: '付款' },
    { roomStatus: 4, roomStatusName: '入住' },
    { roomStatus: 5, roomStatusName: '维修' },
]