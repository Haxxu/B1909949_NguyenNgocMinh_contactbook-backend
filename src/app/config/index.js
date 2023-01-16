const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri:
            process.env.MONGODB_URI ||
            "mongodb+srv://haxu:User12345!@cluster0.irctmzi.mongodb.net/?retryWrites=true&w=majority",
    },
};

module.exports = config;
