import { TechnosList } from '@constants';
import { Project, ProjectContext, ProjectType } from '@models';

export const nuxtTypeRouterProject: Project = {
  title: 'nuxt-typed-router',
  picture:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fnuxt-typed-router%2Fnuxt-ty.png?alt=media&token=d7b5f039-4ad7-4448-946d-07346452b782',
  placeholder:
    'https://firebasestorage.googleapis.com/v0/b/vicflix-2fbe0.appspot.com/o/Pictures%2FProjects%2Fnuxt-typed-router%2Fnuxt-ty.png?alt=media&token=d7b5f039-4ad7-4448-946d-07346452b782',
  slogan: '🚦 Provide autocompletion for pages route names generated by Vue router',
  description: `Nuxt is great because it generate the router based on your pages directory. It generates all the pages name and it abstract a lot of boilerplate.
    Problem: If you want a type-safe routing flow, the current model can be hard to maintain if you modify the page file name and is error prone in big projects.
    
    Solution: Thanks to Nuxt powerful hook system, this module reads all your routes and generate typings and enums accordingly`,
  logo: 'github.png',
  videos: [],
  year: 2019,
  links: [
    {
      title: 'Github homepage',
      link: 'https://github.com/victorgarciaesgi/nuxt-typed-router',
    },
  ],
  badges: [
    {
      img: 'https://img.shields.io/npm/v/nuxt-typed-router.svg',
      link: 'https://www.npmjs.com/package/nuxt-typed-router',
    },
    {
      img: 'https://img.shields.io/npm/dm/nuxt-typed-router.svg',
      link: 'https://www.npmjs.com/package/nuxt-typed-router',
    },
    {
      img: 'https://img.shields.io/npm/dt/nuxt-typed-router.svg',
      link: 'https://www.npmjs.com/package/nuxt-typed-router',
    },
    {
      img: 'https://img.shields.io/npm/l/nuxt-typed-router.svg',
    },
  ],
  type: [ProjectType.Library],
  id: 'VNVlnnlz',
  technos: [TechnosList.Typescript, TechnosList.Nuxt],
  context: ProjectContext.Personal,
};
