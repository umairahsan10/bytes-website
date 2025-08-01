export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Unique ID for the blog post (used for category calculation)',
      validation: (Rule: any) => Rule.required().integer().positive(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The main title of the blog post',
      validation: (Rule: any) => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title (auto-generated)',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) => input
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 96),
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the blog post (shown in blog listings)',
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'listingImage',
      title: 'Listing Image',
      type: 'image',
      description: 'Image shown in blog grid/listings (1:1 aspect ratio recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          options: {
            isHighlighted: true,
          },
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'detailImage',
      title: 'Detail Image',
      type: 'image',
      description: 'Image shown on individual blog page (16:9 aspect ratio recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          options: {
            isHighlighted: true,
          },
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Blog category (SEO, WEB, APP, MARKETING)',
      options: {
        list: [
          { title: 'SEO', value: 'SEO' },
          { title: 'WEB', value: 'WEB' },
          { title: 'APP', value: 'APP' },
          { title: 'MARKETING', value: 'MARKETING' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When the blog post was published',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'The main content of the blog post',
      of: [
        {
          name: 'contentBlock',
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          name: 'contentImage',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              options: {
                isHighlighted: true,
              },
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
        {
          name: 'codeBlock',
          type: 'block',
          styles: [
            { title: 'Code', value: 'code' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
          },
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      description: 'Comprehensive SEO metadata for search engines and social media',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Title used for search engines (60 characters max, if blank, post title will be used)',
          validation: (Rule: any) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines (160 characters max, if blank, excerpt will be used)',
          validation: (Rule: any) => Rule.max(160),
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          description: 'Target keywords for SEO (comma-separated)',
          of: [{ type: 'string' }],
          options: {
            layout: 'tags',
          },
        },
        {
          name: 'focusKeyword',
          title: 'Focus Keyword',
          type: 'string',
          description: 'Primary keyword for this post (used for internal linking)',
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Canonical URL if different from default /blogs/[slug]',
        },
        {
          name: 'ogTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media sharing (if blank, meta title will be used)',
          validation: (Rule: any) => Rule.max(60),
        },
        {
          name: 'ogDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 2,
          description: 'Description for social media sharing (if blank, meta description will be used)',
          validation: (Rule: any) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing (if blank, detail image will be used)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'twitterCard',
          title: 'Twitter Card Type',
          type: 'string',
          description: 'Type of Twitter card to display',
          options: {
            list: [
              { title: 'Summary', value: 'summary' },
              { title: 'Summary Large Image', value: 'summary_large_image' },
            ],
            layout: 'radio',
          },
          initialValue: 'summary_large_image',
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false,
        },
        {
          name: 'noFollow',
          title: 'No Follow',
          type: 'boolean',
          description: 'Prevent search engines from following links on this page',
          initialValue: false,
        },
      ],
    },
    {
      name: 'internalLinking',
      title: 'Internal Linking',
      type: 'object',
      description: 'Internal linking settings for SEO and user experience',
      fields: [
        {
          name: 'relatedPosts',
          title: 'Related Posts',
          type: 'array',
          description: 'Manually select related posts to link to',
          of: [
            {
              type: 'reference',
              to: [{ type: 'post' }],
            },
          ],
        },
        {
          name: 'linkKeywords',
          title: 'Link Keywords',
          type: 'array',
          description: 'Keywords that should be automatically linked to other posts',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'keyword',
                  title: 'Keyword',
                  type: 'string',
                  description: 'The keyword to link',
                },
                {
                  name: 'targetPost',
                  title: 'Target Post',
                  type: 'reference',
                  to: [{ type: 'post' }],
                  description: 'The post to link to',
                },
                {
                  name: 'linkText',
                  title: 'Link Text',
                  type: 'string',
                  description: 'Custom link text (if different from keyword)',
                },
              ],
            },
          ],
        },
        {
          name: 'autoLinkKeywords',
          title: 'Auto-Link Keywords',
          type: 'boolean',
          description: 'Automatically link keywords found in content to other posts',
          initialValue: true,
        },
        {
          name: 'maxInternalLinks',
          title: 'Maximum Internal Links',
          type: 'number',
          description: 'Maximum number of internal links to add to this post',
          initialValue: 5,
          validation: (Rule: any) => Rule.min(0).max(20),
        },
      ],
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Publication status',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      publishedAt: 'publishedAt',
      media: 'listingImage',
    },
    prepare(selection: any) {
      const { title, category, publishedAt, media } = selection;
      return {
        title: title,
        subtitle: `${category} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No date'}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: 'Publication Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Publication Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'ID, High to Low',
      name: 'idDesc',
      by: [{ field: 'id', direction: 'desc' }],
    },
    {
      title: 'ID, Low to High',
      name: 'idAsc',
      by: [{ field: 'id', direction: 'asc' }],
    },
  ],
}; 