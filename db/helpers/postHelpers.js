const db = require('../dbConfig');

module.exports = {
	getPosts() {
		let comments = db
			.select(db.raw('count(post_id)::integer'))
			.from('comments')
			.whereRaw('post_id = p.id')
			.as('comment_count');

		return db('posts as p')
			.join('users as u', 'u.id', 'p.author')
			.select(
				'p.id',
				'p.title',
				'p.body',
				'p.created_at',
				'u.username as author',
				'u.img_url as author_img',
				comments,
			);
	},
	async getPost(id) {
		let post = await db('posts').where({ id }).first();
		if (!post) return null;
		let author = await db('users')
			.where('id', post.author)
			.select('id', 'username', 'img_url')
			.first();
		let comments = await db('comments as c')
			.where('post_id', id)
			.join('users as u', 'u.id', 'c.author')
			.select(
				'c.id',
				'c.text',
				'u.username as author',
				'u.img_url as author_img',
				'c.created_at',
			);
		post.author = author;
		post.comments = comments;

		return post;
	},
	createPost(post) {
		return db('posts').returning('id').insert(post);
	},
	updatePost({ title = undefined, body = undefined }, id) {
		return db('posts').where({ id }).returning('id').update({ title, body });
	},
	deletePost(id) {
		return db('posts').where({ id }).del();
	},
};
