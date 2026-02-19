class ApiResponce {
    constructor(statusCode, message = "success", data = {}, errors = []) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
        this.data = data;
        this.errors = errors;
    }
}

export default ApiResponce;
