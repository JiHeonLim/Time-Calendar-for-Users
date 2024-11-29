//UserData.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    googleId: { // Google 사용자 ID
        type: String,
        unique: true // 동일한 사용자 ID 중복 방지
    },
    displayName: { // 사용자 이름
        type: String
    },
    email: { // 사용자 이메일
        type: String
    },
    photo: { // 프로필 사진
        type: String
    },
    title: {
        type: String,
        required: true
    },
    start: {
        type: String,
    },
    end: {
        type: String,
    },
    color: {
        type: String
    },
    allDay: {
        type: Boolean
    },
    category: {
        type: String,
    }
});

const UserData = mongoose.model('UserData', dataSchema);

module.exports = UserData;