

interface config_type {
    prod: boolean,
    port: string,
    db: {
        host:string,
        port:string,
        user:string,
        pass:string,
        name:string
    }
}

export const config:config_type = {
    "prod":process.env.prod == "true" ?? false,
    "port":process.env.port ?? "4010",
    "db":{
        "host":process.env.DB_HOST ?? "localhost",
        "port":"27017",
        "user":process.env.DB_USER ?? "",
        "pass":process.env.DB_PASS ?? "",
        "name":"counting"
    }
}
