import bcrypt from "bcryptjs";

async function run() {
  const password = "teste";
  const hash = await bcrypt.hash(password, 11);
  console.log("Hash gerado:", hash);
}

run();