$(function () {
    init()
    var layer = layui.layer
    var form = layui.form
    //获取文章分类列表
    function init() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlstr = template('table', res)
                $('tbody').html(htmlstr)
            }
        })
    }

    var indexAdd = null
    $('#btnAddCate').on('click', function (e) {
        indexAdd=layer.open()
        layer.open({
            type: 1,
            title: '添加文章分类'
            , content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        var data = $(this).serialize()
        //return;
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                init()
                layer.msg('新增文章分类成功')
                layer.close(indexAdd)
            }
        })
    })

    //点击编辑弹出层
    var indexedit=null
    $('tbody').on('click','.btn-edit',function(e){
        var id=$(this).attr('data-id')
        indexedit=layer.open({
            type: 1,
            title: '修改文章分类'
            , content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        })
        $.ajax({
            type:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
                form.val('form-edit',res.data)  
            } 
        })
    })
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
     $.ajax({
         type:'POST',
         url:'/my/article/updatecate',
         data:$(this).serialize(),
         success:function(res){
             if (res.status !== 0) {
                 return layer.msg('修改文章分类失败！')
             }
             init()
             layer.msg('修改文章分类成功')
             layer.close(indexedit)
         }

     })

    })
   $('tbody').on('click','.btn-remove',function(e){
       var id = $(this).attr('data-id')
       e.preventDefault()
       layer.confirm('确认删除?', { icon: 3, title: '确认删除'}, function(index) {
        $.ajax({
            type:'GET',
            url:'/my/article/deletecate/'+id,
            success:function(res){
               if(res.status!==0) {
                   return layer.msg('删除失败')
               }
               layer.msg('删除成功')
               layer.close(index)
               init()
            } 
           })
       })
      
   })


















})