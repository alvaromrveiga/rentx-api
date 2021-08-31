import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import createConnection from "..";

async function create() {
  const connection = await createConnection("localhost");

  const id = uuidV4();
  const password = await hash("adminPa$$w0rd", 10);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", driver_license, created_at)
    VALUES ('${id}', 'admin','admin@rentx.com.br', '${password}', true, 'XXXXXX', 'now()')
    `
  );

  await connection.close();
}

create().then(() => {
  console.log("Admin user created");
});
