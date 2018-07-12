exports.up = (knex, Promise) => {
    return knex.schema.createTable('movie_like', (table) => {
        table.increments();
        table.integer('movie_id').references('id').inTable('movies').notNull().onDelete('cascade');
        table.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
        table.integer('rate').notNull();
        table.unique(['movie_id', 'user_id']);
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('movie_like');
};