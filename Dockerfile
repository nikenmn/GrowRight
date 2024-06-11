# Menggunakan Node.js 18 sebagai base image
FROM node:18

# Membuat dan menetapkan direktori kerja di container
WORKDIR /usr/src/app

# Menyalin package.json dan package-lock.json
COPY package*.json ./

# Menginstal dependensi
RUN npm install

# Menyalin kode aplikasi ke dalam container
COPY . .

# Menyediakan port yang akan digunakan oleh aplikasi
EXPOSE 3000

# Menjalankan aplikasi
CMD ["npm", "start"]
