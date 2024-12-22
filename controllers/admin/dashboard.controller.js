module.exports.index = async (req, res) => {
    res.render('admin/page/dashboard/index', { 
        title: 'Products',
    })
}