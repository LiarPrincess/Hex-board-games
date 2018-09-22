const fs = require('fs').promises;

const encoding = 'utf8';
const createFilePath = (id) => `./cache/${id}`;

async function get(id) {
  try {
    const filePath = createFilePath(id);
    return await fs.readFile(filePath, encoding);
  } catch (error) {
    return null;
  }
}

async function put(id, data) {
  const filePath = createFilePath(id);
  await fs.writeFile(filePath, data, encoding)
}

module.exports = { get, put };
