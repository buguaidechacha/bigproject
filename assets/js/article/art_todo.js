$(function () {
    // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
    var params = new URLSearchParams(location.search)
    var artId = params.get('id')

    // 文章的发布状态
    var pubState = ''

    var layer = layui.layer
    var form = layui.form
    //初始化文章分类列表
    init()
    //渲染文章分类列表
    function init() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlstr = template('table-tpl', res)
                $('[name=cate_id]').html(htmlstr)
                form.render()
                getArticleById()
            }
        })
    }

    function getArticleById() {
        // 发起请求，获取文章详情
        $.get('/my/article/' + artId, function(res) {
          // 获取数据失败
          if (res.status !== 0) {
            return layer.msg('获取文章失败！')
          }
          // 获取数据成功
          var art = res.data
          // 为 form 表单赋初始值
          form.val('addArticle', {
            Id: art.Id,
            title: art.title,
            cate_id: art.cate_id,
            content: art.content
          })
        })
    }   
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    //点击按钮选择图片
    $('#btnAdd').on('click', function () {
        $('#coverfile').click()
    })

    //获取用户选择的文件列表
    $('#coverfile').on('change', function (e) {
        var files = e.target.files
        if (files.length == 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    var savestate = '已发布'
    $('#btnsave2').on('click', function () {
        savestate = '草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#formadd').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', savestate)
        console.log(fd);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})