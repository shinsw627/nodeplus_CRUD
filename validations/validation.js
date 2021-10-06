module.exports = {
    isEmail: (email) => {
        const [localPart, domain, ...etc] = email.split('@')

        const email_check =
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

        const id = email.split('@')[0]

        if (!email_check.test(email)) {
            return false
        }

        return true
    },
    isNick: (nickname) => {
        const nick_check = /^[a-zA-Z가-힣]+[a-zA-z가-힣0-9]{3,7}$/g

        if (!nick_check.test(nickname)) {
            return false
        }
        return true
    },
    isPassword: (value) => {
        const pw_check = /^[a-zA-Z]+[a-z0-9~!@#$%^&*()_+<>?:{}]{3,15}$/g

        if (!pw_check.test(password)) {
            return false
        }
        return true
    },
    isPassword: (value) => {
        const regex = new RegExp(id)
        const regexnick = new RegExp(nickname)

        if (regex.test(password) || regexnick.test(password)) {
            res.status(400).send({
                errorMessage:
                    '패스워드에 아이디나 닉네임과 같은 값을 사용할 수 없습니다.',
            })
            return
        }
    },
}
