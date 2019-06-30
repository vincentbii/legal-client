import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN, PRIORITY_LIST_SIZE } from '../constants';
import jwt_decode from "jwt-decode";
import { func } from 'prop-types';

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

export function getAllReligions() {
    return request({
        url: API_BASE_URL + "/religion",
        method: 'GET'
    });
}

export function deleteReligion(url) {
    return request({
        url: url,
        method: 'DELETE'
    })
}

export function updateReligion(data, method) {
    return request({
        url: data.url,
        method: method,
        body: JSON.stringify(data)
    })
}

export function getNationalities() {
    return request({
        url: API_BASE_URL + "/nationality",
        method: 'GET'
    });
}

export function updateNationality(data, method) {
    const url = method == 'PATCH' ? data.url : API_BASE_URL + "/nationality/";
    return request({
        url: url,
        method: method,
        body: JSON.stringify(data)
    })
}

export function deleteNationality(url) {
    return request({
        url: url,
        method: 'DELETE'
    })
}

export function getClients() {
    return request({
        url: API_BASE_URL + "/clients",
        method: 'GET'
    });
}

export function updateClient(data, method) {
    const url = method == 'PATCH' ? data.url : API_BASE_URL + "/clients/";
    return request({
        url: url,
        method: method,
        body: JSON.stringify(data)
    })
}

export function deleteClient(url) {
    return request({
        url: url,
        method: 'DELETE'
    })
}

export function getJobType() {
    return request({
        url: API_BASE_URL + "/jobtype",
        method: 'GET'
    });
}

export function updateJobType(data, method) {
    const url = method == 'PATCH' ? data.url : API_BASE_URL + "/jobtype/";
    return request({
        url: url,
        method: method,
        body: JSON.stringify(data)
    })
}

export function deleteJobType(data) {
    return request({
        url: API_BASE_URL + '/jobtype/deleteall/',
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function getDepartment(){
    return request({
        url: API_BASE_URL + "/department",
        method: 'GET'
    });
}

export function updateDepartment(data, method) {
    const url = method == 'PATCH' ? data.url : API_BASE_URL + "/department/";
    return request({
        url: url,
        method: method,
        body: JSON.stringify(data)
    })
}

export function deleteDepartment(data) {
    return request({
        url: API_BASE_URL + '/department/',
        method: 'POST',
        body: JSON.stringify(data)
    })
}