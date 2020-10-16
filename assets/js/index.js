$(function () {
    //调用getUserInfo()获取基本信息
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地存储中的token
            localStorage.removeItem('token')
            //2.重新跳转到登录页
            location.href = "/login.html"
            layer.close(index)
        });
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            console.log(res);
            //调用渲染用户头像
            renderAvatar(res.data)
        },
        //无论成功还是失败，都会调用这个函数
        // complete:function(res){
        //   if(res.responseJSON.status===1&&res.responseJSON.message==='身份认证失败!'){
        //       console.log(111);
        //       //1.强制清空token
        //       localStorage.removeItem('token')
        //       //2.强制跳转到登录页面
        //       location.href = "/login.html"
        //   }
        // }
       
    })
}

//渲染用户信息头像
function renderAvatar(user) {
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;' + name)
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr("src", user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}