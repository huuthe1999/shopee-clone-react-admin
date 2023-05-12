import { PATHS, RESOURCES } from "@constants";
import {
    AuthPage,
    ErrorComponent,
    ThemedLayoutV2,
    ThemedSiderV2,
    ThemedTitleV2,
    notificationProvider,
} from "@refinedev/antd";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { Header, LogoIcon } from "components";
import { axiosInstance } from "config";
import { ColorModeContextProvider } from "contexts";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";

import { DashboardOutlined } from "@ant-design/icons";
import "@refinedev/antd/dist/reset.css";
import { CategoryList } from "pages/category";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <Refine
                        authProvider={authProvider}
                        notificationProvider={notificationProvider}
                        routerProvider={routerBindings}
                        dataProvider={dataProvider(
                            process.env.REACT_APP_BASE_URL as string,
                            axiosInstance
                        )}
                        resources={[
                            {
                                name: RESOURCES.categories,
                                list: `${PATHS.categories.default}`,
                                // show: `${PATHS.categories.default}/${PATHS.categories.show}`,
                                create: `${PATHS.categories.default}/${PATHS.categories.create}`,
                                // edit: `${PATHS.categories.default}/${PATHS.categories.edit}`,
                                meta: {
                                    canDelete: true,
                                    label: "Danh mục",
                                    icon: <DashboardOutlined />,
                                },
                            },
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            reactQuery: {
                                clientConfig: {
                                    defaultOptions: {
                                        queries: {
                                            retry: false,
                                        },
                                    },
                                },
                            },
                        }}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated
                                        fallback={
                                            <CatchAllNavigate
                                                to={PATHS.login}
                                            />
                                        }
                                    >
                                        <ThemedLayoutV2
                                            Header={() => <Header sticky />}
                                            Sider={() => (
                                                <ThemedSiderV2
                                                    fixed
                                                    Title={({ collapsed }) => (
                                                        <ThemedTitleV2
                                                            // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                                                            collapsed={
                                                                collapsed
                                                            }
                                                            icon={<LogoIcon />}
                                                            text="Shopee Admin"
                                                        />
                                                    )}
                                                />
                                            )}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route index element={<NavigateToResource />} />

                                <Route path={PATHS.categories.default}>
                                    <Route index element={<CategoryList />} />
                                    {/* <Route path={`${PATHS.categories.show}`} element={<BlogPostShow />} />
									<Route path={`${PATHS.categories.edit}`} element={<BlogPostEdit />} /> */}
                                    {/* <Route
                                        path={`${PATHS.categories.create}`}
                                        element={<CategoryCreate />}
                                    /> */}
                                </Route>
                            </Route>

                            <Route
                                element={
                                    <Authenticated fallback={<Outlet />}>
                                        <NavigateToResource />
                                    </Authenticated>
                                }
                            >
                                <Route
                                    path={PATHS.login}
                                    element={
                                        <AuthPage
                                            type="login"
                                            title={
                                                <ThemedTitleV2
                                                    collapsed={false}
                                                    text="Shoppe Admin"
                                                />
                                            }
                                        />
                                    }
                                />
                                <Route
                                    path={PATHS.register}
                                    element={<AuthPage type="register" />}
                                />
                            </Route>

                            <Route
                                element={
                                    <Authenticated fallback={<Outlet />}>
                                        <ThemedLayoutV2
                                            Sider={() => (
                                                <ThemedSiderV2 fixed />
                                            )}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route path="*" element={<ErrorComponent />} />
                            </Route>
                        </Routes>
                        <RefineKbar />
                        <UnsavedChangesNotifier />
                    </Refine>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
