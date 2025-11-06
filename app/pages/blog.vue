<template>
  <div class="page">
    <header class="page__header">
      <span class="badge">Stories</span>
      <h1 class="page__title">Insights for ambitious commerce teams</h1>
      <p class="page__subtitle">
        Field notes, playbooks, and interviews from the Metro community—crafted to help you launch, grow, and delight.
      </p>
    </header>

    <section class="blog-grid">
      <article v-for="post in posts" :key="post.id" class="blog-card">
        <NuxtLink :to="post.href" class="blog-card__media">
          <img :src="post.imageUrl" :alt="post.title" loading="lazy" />
        </NuxtLink>

        <div class="blog-card__body">
          <NuxtLink :to="post.category.href" class="blog-card__category">
            {{ post.category.name }}
          </NuxtLink>
          <NuxtLink :to="post.href">
            <h2 class="blog-card__title">{{ post.title }}</h2>
          </NuxtLink>
          <p class="blog-card__excerpt">{{ post.description }}</p>

          <div class="blog-card__footer">
            <NuxtLink :to="post.author.href">
              <img :src="post.author.imageUrl" :alt="post.author.name" class="blog-card__author-avatar" loading="lazy" />
            </NuxtLink>
            <div>
              <NuxtLink :to="post.author.href" style="font-weight:600; color:var(--slate-900);">
                {{ post.author.name }}
              </NuxtLink>
              <div class="blog-card__meta">
                <time :datetime="post.datetime">{{ post.date }}</time>
                <span aria-hidden="true">·</span>
                <span>{{ post.readingTime }} read</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="highlight-card" style="display:grid; gap:18px; text-align:center;">
      <span class="badge" style="justify-self:center;">Stay in the loop</span>
      <h2 class="section__title" style="margin:0;">Subscribe to the Metro Field Notes</h2>
      <p class="text-muted" style="margin:0 auto; max-width:540px;">
        A twice-monthly digest sharing merchandising frameworks, customer experience insights, and a peek at new product
        launches across the Metro ecosystem.
      </p>
      <form class="form-grid" style="max-width:480px; margin:0 auto;">
        <label class="form-row" style="margin:0;">
          <span class="label">Email</span>
          <input type="email" class="input-field" placeholder="you@studio.com" />
        </label>
        <button type="button" class="btn btn--primary" style="justify-content:center;">Join the newsletter</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
const posts = [
  {
    id: 1,
    title: 'Reset your merchandising for adaptive retail journeys',
    href: '/blog/merchandising-reset',
    description:
      'Practical frameworks that blend storytelling with data science to keep your catalogue relevant week after week.',
    category: { name: 'Merchandising', href: '/blog?category=merchandising' },
    date: 'Nov 12, 2024',
    datetime: '2024-11-12',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80',
    readingTime: '6 min read',
    author: {
      name: 'Jane Cooper',
      href: '/team/jane-cooper',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    title: 'What 10,000 carts taught us about conversion storytelling',
    href: '/blog/conversion-storytelling',
    description:
      'Microcopy, trust markers, and animation that help customers feel confident from discovery to checkout.',
    category: { name: 'Customer Experience', href: '/blog?category=experience' },
    date: 'Oct 25, 2024',
    datetime: '2024-10-25',
    imageUrl: 'https://images.unsplash.com/photo-1607082349566-0073eccd09b4?auto=format&fit=crop&w=1400&q=80',
    readingTime: '4 min read',
    author: {
      name: 'John Smith',
      href: '/team/john-smith',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    title: 'Building a sustainable supply chain without slowing growth',
    href: '/blog/sustainable-supply',
    description:
      'How Metro partners audit suppliers, reduce returns, and lean on circular initiatives to protect the planet.',
    category: { name: 'Operations', href: '/blog?category=operations' },
    date: 'Sep 30, 2024',
    datetime: '2024-09-30',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1400&q=80',
    readingTime: '8 min read',
    author: {
      name: 'Emma Johnson',
      href: '/team/emma-johnson',
      imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=facearea&w=256&h=256&q=80',
    },
  },
];
</script>
