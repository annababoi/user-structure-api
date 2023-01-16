const RoleHierarchy = require("role-hierarchy/source/role-hierarchy");
let usersHierarchy = {
    "name": "admin",
    "subordinates": [
        {
            "name": "boss",
            "subordinates": [
                {
                    "name": "user"
                }
            ]
        }
    ],
    "defaultNewUserRoles": [
        "user"
    ],
}

let roleHierarchy = new RoleHierarchy(
    {
        "rolesHierarchy": usersHierarchy,
        "loggingConfig": {level: "debug"},
        treeModelConfig: {"childrenPropertyName": "subordinates"},
    }
)

