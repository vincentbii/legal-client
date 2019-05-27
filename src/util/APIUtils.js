import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN, PRIORITY_LIST_SIZE } from '../constants';
import jwt_decode from "jwt-decode";

function getDecodedAccessToken(token) {
    try {
        return jwt_decode(token);
    }
    catch (Error) {
        return null;
    }
}

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)
    });
}

export function deletePriority(target) {
    return request({
        url: target.url,
        method: 'DELETE'
    });
}

export function updatePriority(priority, method) {
    const url = method == 'PATCH' ? priority.url : API_BASE_URL + "/priorities/";
    return request({
        url: url,
        method: method,
        body: JSON.stringify(priority)
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/api/token/",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    let user = getDecodedAccessToken(localStorage.getItem(ACCESS_TOKEN));
    // console.log(user['user_id'])
    return request({
        url: API_BASE_URL + "/users/" + user['user_id'],
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllPriorities() {
    return request({
        url: API_BASE_URL + "/priorities",
        method: 'GET'
    });
}

export function getAllReligions(){
    return request({
        url: API_BASE_URL + "/religion",
        method: 'GET'
    });
}

export function deleteReligion(url){
    return request({
        url: url,
        method: 'DELETE'
    })
}

export function updateReligion(data, method){
    return request({
        url: data.url,
        method: method,
        body: JSON.stringify(data)
    })
}