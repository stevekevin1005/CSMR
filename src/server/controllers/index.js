let index = async(ctx, next) => {
    await ctx.render('views/index')
}

module.exports = [{
    method: 'get',
    uri: '/',
    fn: index,
}]