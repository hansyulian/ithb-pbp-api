const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("admin", "common"),
        allowNull: false,
        defaultValue: "common",
      },
      status: {
        type: Sequelize.ENUM("pending", "active", "suspended"),
        allowNull: false,
        defaultValue: "active",
      },
      resetTokenExpiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    const id = "00000000-0000-4000-8000-000000000001";
    const name = "Admin";
    const email = "admin@email.com";
    const password = await bcrypt.hash(
      "Pass1234",
      process.env.HASH_SALT ? parseInt(process.env.HASH_SALT) : 10
    );
    const status = "active";
    const now = new Date();
    const createdAt = now;
    const updatedAt = now;
    const role = "admin";

    await queryInterface.sequelize.query(
      `INSERT INTO "Users" ("id", "name", "email", "password", "status", "createdAt", "updatedAt","role")
      VALUES (:id, :name, :email, :password, :status, :createdAt, :updatedAt, :role)`,
      {
        replacements: {
          id,
          name,
          email,
          password,
          status,
          createdAt,
          updatedAt,
          role,
        },
        type: Sequelize.QueryTypes.INSERT,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
