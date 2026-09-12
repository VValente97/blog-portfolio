(() => {
  const feedRoot = document.querySelector('#feed-posts');
  const posts = Array.isArray(window.blogFeedPosts) ? window.blogFeedPosts : [];

  if (!feedRoot) return;

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const createBlogPreview = () => {
    const preview = createElement('div', 'blog-post-preview');
    preview.setAttribute('role', 'img');
    preview.setAttribute('aria-label', 'Prévia visual do blog pessoal de João Vitor Valente');

    const bar = createElement('div', 'blog-preview-bar');
    ['red', 'yellow', 'green'].forEach(() => bar.append(createElement('i')));
    bar.append(createElement('span', '', 'joaovitor.dev'));

    const body = createElement('div', 'blog-preview-body');
    const watermark = createElement('span', 'blog-preview-logo', 'JV.');
    const copy = createElement('div', 'blog-preview-copy');
    const name = createElement('b');
    name.append(document.createTextNode('João Vitor'));
    name.append(document.createElement('br'));
    const surname = createElement('em', '', 'Valente.');
    name.append(surname);
    copy.append(name, createElement('small', '', 'Portfólio vivo'));

    const stackCard = createElement('div', 'blog-preview-card');
    stackCard.append(createElement('span', '', 'FULLSTACK'), createElement('strong', '', '</>'));
    body.append(watermark, copy, stackCard);
    preview.append(bar, body);
    return preview;
  };

  const createPost = (post) => {
    const article = createElement('article', 'social-post social-post-featured');
    const header = createElement('header');
    const avatar = createElement('div', 'post-avatar', 'JV');
    const author = createElement('div');
    author.append(createElement('strong', '', 'João Vitor Valente'), createElement('span', '', post.category));
    const options = createElement('button', '', '•••');
    options.type = 'button';
    options.setAttribute('aria-label', 'Mais opções');
    header.append(avatar, author, options);

    const content = createElement('div', 'post-content');
    content.append(createElement('h3', '', post.title));
    if (post.preview === 'blog') content.append(createBlogPreview());
    content.append(createElement('p', '', post.description));

    const footer = createElement('footer');
    footer.append(createElement('span', '', '♡ 0'), createElement('span', '', '↗ compartilhar'), createElement('span', '', post.action));
    article.append(header, content, footer);
    return article;
  };

  posts.forEach((post) => feedRoot.append(createPost(post)));

  const count = String(posts.length).padStart(2, '0');
  document.querySelector('[data-feed-count]')?.replaceChildren(document.createTextNode(count));
  document.querySelector('[data-feed-label]')?.replaceChildren(document.createTextNode(posts.length === 1 ? 'post' : 'posts'));
})();
