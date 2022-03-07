module.exports = class CustomError extends Error {
    constructor(message) {
        super(message); // 여기에 더 message 이외에 더 많은 종류의 응답을 추가할 수 있습니다!
    }
}