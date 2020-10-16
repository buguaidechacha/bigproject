$(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    //通过form.verify（）函数自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            //形参value是确认密码框的内容
            //还需要拿到密码框中的内容
            //进行hi此等于的判断
            //如果判断失败，return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        // var data = {
        //     username: $('#form_reg [name=username]').val(),
        //     password:$('#form_reg [name=password]').val()
        // }
        var data = $(this).serialize()
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return console.log(res.message);
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                //注册成功后自动跳转到登录页面
                $('#link_login').click()
            }
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res.status);
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('注册成功')
                //将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })








})