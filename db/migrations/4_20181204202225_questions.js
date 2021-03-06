exports.up = function(knex, Promise) {
	return knex.schema.createTable('questions', table => {
		table.increments();
		table.string('question').notNullable();
		table.string('option1').notNullable();
		table.string('option2').notNullable();
		table.string('option3');
		table.string('option4');
		table.integer('answer').unsigned();
		table.integer('author').unsigned().references('users.id');
		table.integer('quiz_id').unsigned().references('quizzes.id').onDelete('CASCADE');
	});
};

exports.down = function(knex, Promise) {
	return knex.scema.dropTableIfExists('questions');
};
