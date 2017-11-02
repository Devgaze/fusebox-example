# Setup 
Clone, install, start the server
```bash
git clone https://github.com/Devgaze/fusebox-example.git
cd fusebox-example
npm i
npm start
```

and follow the [link](http://localhost:7000).

I have two following issues.

## Deep linking issue

There are two components in this example 
* root route - loading `public-comp` component
* 404 route - loading `shared/components/404` component

<small>app-routing.module.ts</small>
```typescript
// excerpt
const ROUTES: Routes = [
  { path: '', component: PublicComponent, pathMatch: 'full' },
  { path: '404', component: Noauth404Component, pathMatch: 'full'},
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];
```

Problem is you can't access `404` view by going directly to [http://localhost:7000/404](http://localhost:7000/404), yet it's accessible programatically (ie. through `routerLink`).

## Using and copying assets from node_modules packages

So, we have our in-house npm package which takes care of our corporate style guide. 
That package containes `fonts` folder with our fonts and it the funny thing is, font's do get loaded in the page but I'm seeing following

![Network tab](https://raw.githubusercontent.com/Devgaze/fusebox-example/master/src/assets/network-tab.jpg)  

and

![Console tab](https://github.com/Devgaze/fusebox-example/blob/master/src/assets/console-tab.png)  

What I've observed is that font files have not been copied to my `dist/assets` folder and I've seen few threads on this but they were not really useful for me.

I understand it must be something due to bad configuration in `fuse.js`.
