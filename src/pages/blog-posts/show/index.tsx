import { DateField, MarkdownField, NumberField, Show, TextField } from '@refinedev/antd'
import { IResourceComponentsProps, useOne, useShow } from '@refinedev/core'
import { Typography } from 'antd'
import React from 'react'

const { Title } = Typography

export const BlogPostShow: React.FC<IResourceComponentsProps> = () => {
	const { queryResult } = useShow()
	const { data, isLoading } = queryResult

	const record = data?.data

	const { data: categoryData, isLoading: categoryIsLoading } = useOne({
		resource: 'categories',
		id: record?.category?.id || '',
		queryOptions: {
			enabled: !!record
		}
	})

	return (
		<Show isLoading={isLoading}>
			<Title level={5}>Id</Title>
			<NumberField value={record?.id ?? ''} />
			<Title level={5}>Title</Title>
			<TextField value={record?.title} />
			<Title level={5}>Content</Title>
			<MarkdownField value={record?.content} />
			<Title level={5}>Category</Title>
			{categoryIsLoading ? <>Loading...</> : <>{categoryData?.data?.title}</>}
			<Title level={5}>Status</Title>
			<TextField value={record?.status} />
			<Title level={5}>Created At</Title>
			<DateField value={record?.createdAt} />
		</Show>
	)
}
