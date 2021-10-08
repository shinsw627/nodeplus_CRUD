async function OnlyAuthenticated(req, res, next) {
    if (!req.user) {
        res.send(`<script>alert('로그인이 필요합니다.'); location = "/sign-in"</script>`)
        return;
    }
    next();
}

module.exports = OnlyAuthenticated
