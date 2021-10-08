async function OnlyAnonymous(req, res, next) {
    if (req.user) {
        res.send(`<script>alert('이미 로그인이 되었습니다.'); location = "/" </script>`)
        return;
    }
    next();
}

module.exports = OnlyAnonymous
