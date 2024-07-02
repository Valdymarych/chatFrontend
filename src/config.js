const config = {
    axiosBaseURL:"http://localhost:3001",
    isFetchingStatuses: {
        ok: "ok",
        waiting: "waiting",
        error: "error",
        done: "done"
    },
    isAuthingStatuses: {
        in: "in",
        waiting: "waiting",
        error: "error",
        out:"out"
    },
    formFieldsStatuses: {
        ok: "ok",
        error: "error"
    },
    messageTypes:{
        text: "text",
        file: "file"
    },
    joiningGroup: {
        name: "...",
        lastMessage: {type:"text",payload:"...",owner: {name:"...",_id:""}},
        _id: "joiningGroup",
        isFetching: "waiting"
    },
    navbarButtonsText: {
        logout: "LOG OUT",
        login: "LOG IN",
        signin: "SIGN IN"
    },
    groupDeletingQuestion: "Ви впевнені що бажаєте видалити групу для всіх? Це незворотня дія",
    groupDeletingFailMessage: "Не вдалось видалити групу",
    submitRegistrationButtonText: "sign in",
    submitLoginButtonText: "log in",
    altUploadFileInput: "завантажити файл",
    placeholderForInput: "Написати...",
    placeholderForDisabledInput: "Спочатку виберіть групу"
}

export default config