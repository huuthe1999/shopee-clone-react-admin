import { ErrorComponent, ThemedLayoutV2, notificationProvider } from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'
import { GitHubBanner, Refine } from '@refinedev/core'
import { AntdInferencer } from '@refinedev/inferencer/antd'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import routerBindings, {
	NavigateToResource,
	UnsavedChangesNotifier
} from '@refinedev/react-router-v6'
import dataProvider from '@refinedev/simple-rest'
import { BlogPostEdit } from 'pages/blog-posts/edit'
import { BlogPostList } from 'pages/blog-posts/list'
import { BlogPostShow } from 'pages/blog-posts/show'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { ColorModeContextProvider } from './contexts/color-mode'

function App() {
	return (
		<BrowserRouter>
			<GitHubBanner />
			<RefineKbarProvider>
				<ColorModeContextProvider>
					<Refine
						notificationProvider={notificationProvider}
						routerProvider={routerBindings}
						dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
						resources={[
							{
								name: 'blog_posts',
								list: '/blog-posts',
								show: '/blog-posts/show/:id',
								create: '/blog-posts/create',
								edit: '/blog-posts/edit/:id'
							}
						]}
						options={{
							syncWithLocation: true,
							warnWhenUnsavedChanges: true
						}}>
						<Routes>
							<Route
								element={
									<ThemedLayoutV2>
										<Outlet />
									</ThemedLayoutV2>
								}>
								<Route index element={<NavigateToResource resource="blog_posts" />} />
								<Route path="blog-posts">
									<Route index element={<BlogPostList />} />
									<Route path="show/:id" element={<BlogPostShow />} />
									<Route path="edit/:id" element={<BlogPostEdit />} />
									<Route path="create" element={<AntdInferencer />} />
								</Route>
								<Route path="*" element={<ErrorComponent />} />
							</Route>
						</Routes>
						<RefineKbar />
						<UnsavedChangesNotifier />
					</Refine>
				</ColorModeContextProvider>
			</RefineKbarProvider>
		</BrowserRouter>
	)
}

export default App
