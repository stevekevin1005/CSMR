exports.up = (knex, Promise) => {
    return knex.schema.createTable('movies', (table) => {
        table.increments();
        table.string('title').notNullable().unique();
        table.string('genre').notNullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('movies');
};