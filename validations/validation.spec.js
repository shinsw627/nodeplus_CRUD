const { TestWatcher } = require('@jest/core')
const { isEmail, isPassword, isNick } = require('./validation')

test('입력한 - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 이루어져 있어야 합니다. 주', () => {
    expect(isEmail('my-email@domain.com')).toEqual(true)
    expect(isEmail('my-email@@@@@domain.com')).toEqual(false)
    expect(isEmail('my-emaildomain.com')).toEqual(false)
})

test('입력한 이메일 주소에 공백(스페이스)이 존재하면 이메일 형식이 아니다.', () => {
    expect(isEmail('my-email@domain.com')).toEqual(true)
    expect(isEmail('my-e mail@domain.com')).toEqual(false)
})

test('입력한 이메일 주소 맨 앞에 하이픈(-)이 있으면 이메일 형식이 아니다.', () => {
    expect(isEmail('e-m-a-i-l@domain.com')).toEqual(true)
    expect(isEmail('-email@domain.com')).toEqual(false)
})

test('입력한 이메일 주소중, 도메인(골뱅이 기준 뒷부분)에는 영문 대소문자와 숫자, 점(.), 하이픈(-) 외에 다른 값이 존재하면 이메일 형식이 아니다.', () => {
    expect(isEmail('as-df@asdf-d.com')).toEqual(true)
    expect(isEmail('fsdfa@asdf_$.com')).toEqual(false)
})

test('닉네임은 최소 3자 이상 8자 이하, 알파벳 대소문자(a~z, A~Z), 한글, 숫자(0~9)로 이루어져 있어야 합니다.', () => {
    expect(isNick('냥냥343')).toEqual(true)
    expect(isNick('a1')).toEqual(false)
    expect(isNick('sd@#42')).toEqual(false)
    expect(isNick('sdf sdas3')).toEqual(false)
    expect(
        isNick('EWE34sianslkdjfiansleiksnmdikfjsdaidj123135fsnfafsdfa')
    ).toEqual(false)
})

test('비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패합니다.', () => {
    expect(isPassword('asdf1234')).toEqual(true)
    expect(isPassword('as1')).toEqual(false)
})
