$(function () {

    console.log(1);

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    //渲染列表
    // initTable()
    // function initTable() {
    //     //发起请求
    //     $.ajax({
    //         type: 'GET',
    //         url: '/my/article/list',
    //         data: q,
    //         success: function (res) {
    //             if(res.status!==0){
    //                 return layer.msg('获取列表失败')
    //             }
    //             console.log(res);
    //             var htmlstr=template('tpl-table',res)
    //             $('tbody').html(htmlstr)
    //         }
    //     })
    // }
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(1);
                console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res)
            }
        })
    }

    //美化时间结构
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //获取请求并渲染分类的下拉选择框
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取下拉分类列表失败！')
                }
                var htmlstr = template('option-tpl', res)
                console.log(htmlstr);
                $('[name=cate_id]').html(htmlstr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        initTable()
    })

    //渲染分页
    function renderPage(res) {
        laypage.render({
            elem: 'pagetest'
            , count: res.total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                console.log(first);
                console.log(obj.curr);
                if (!first) {
                    initTable()
                }
            }
        });
    }
    //点击删除，删除对应列表
    $('tbody').on('click', '.btn-delete', function (e) {
        var length = $('.btn-delete').length
        e.preventDefault()
        var id = $('.btn-delete').attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '确认删除' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })

    //点击编辑，修改文档
    $('body').on('click', '.btn_edit', function () {
        location.href = '/article/art_todo.html?id=' + $(this).attr('data-id')
    })


















})


