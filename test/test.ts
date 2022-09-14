import serverNoAuthTest from './serverNoAuth'
import serverAuthedTest from './serverAuth'
import { gql } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'

const Client = createTestClient(serverNoAuthTest)
const ClientAuthed = createTestClient(serverAuthedTest)

test('get news', async () => {
    const news: any = gql`
    query {
        getNews(limit: 2, offset: 0, search: "tranh cai", sort: "asc") {
            data {
                _id,
                title,
                thumbUrl,
                description
            }
        }
    }
  `

    const { data: { getNews: { data, error } } } = await Client.query({ query: news })

    expect(error).toBeFalsy()
    expect(data.length).toEqual(2)
    expect(data[0]._id).toEqual('6321b75c561b22566b3842a9')
})

test('get categories', async () => {
    const categories: any = gql`
    query {
        getCategories {
            data {
                _id
                name
                description
            },
            error
        }
    }
  `

    const { data: { getCategories: { data, error } } } = await Client.query({ query: categories })

    expect(error).toBeFalsy()
    expect(data.length).toBeGreaterThan(0)
    expect(data.filter((e: { _id: string }) => e._id === '6321c8cdd5953bf2c5d40ab5').length).toEqual(1)
})

test('get publisher', async () => {
    const publishers: any = gql`
    query {
        getPublisher {
            data {
                _id,
                username,
                email,
                roles
            }
        }
    }
  `

    const { data: { getPublisher: { data, error } } } = await Client.query({ query: publishers })
    
    expect(error).toBeFalsy()
    expect(data.length).toBeGreaterThan(0)
    expect(data.filter((e: { _id: string }) => e._id === '6320fa9bdc6ea5f47fe091a0').length).toEqual(1)
})

test('detail of news', async () => {
    const detailNews: any = gql`
    query {
        getDetailNews(_id: "6321b75c561b22566b3842a9") {
            data {
                _id,
                title,
                description,
                content,
                thumbUrl,
                categories {
                    _id,
                    name,
                    description
                },
                publisher {
                    _id,
                    email,
                    username
                }
            },
            error
        }
    }
  `

    const { data: { getDetailNews: { data, error } } } = await Client.query({ query: detailNews })
    
    expect(error).toBeFalsy()
    expect(data._id === '6321b75c561b22566b3842a9').toBeTruthy()
    expect(data.title || data.description || data.content || data.thumbUrl || data.publisher._id).toBeTruthy()
})

test('auth of get publisher news', async () => {
    const publisherNews: any = gql`
    query {
        getPublisherNews {
            data {
                _id,
                title,
                description,
                content,
                thumbUrl,
            },
            error
        }
    }
  `

    const { data: { getPublisherNews: { data, error } } } = await Client.query({ query: publisherNews })
    
    expect(error.includes('Unauthorized')).toBeTruthy()
})

test('auth of create news', async () => {
    const createNews: any = gql`
    mutation {
        createNews(
            inputObject: { 
                title: "Hàn Quốc phát lệnh bắt Do Kwon",
                thumbUrl: "https://i1-sohoa.vnecdn.net/2022/09/14/-5443-1663143219.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=SjcLj8aDIeqlvs4j73FCYQ",
                description: "Tòa án Seoul ban hành lệnh bắt giữ đối với CEO Terraform Labs Do Kwon và năm người khác để điều tra về thảm họa tiền số Luna."
                content: "Tòa án Seoul ban hành lệnh bắt giữ đối với CEO Terraform Labs Do Kwon và năm người khác để điều tra về thảm họa tiền số Luna.Theo văn phòng công tố tòa án Seoul ngày 14/9, có sáu người trong danh sách bắt giữ do vi phạm quy tắc thị trường vốn quốc gia. Hiện những người này được cho là đang ở Singapore, nơi Terraform Labs đặt trụ sở. Một nguồn tin cho biết, động thái trên nhằm làm sáng tỏ các vấn đề xung quanh sự sụp đổ của hai token trong hệ sinh thái Terra là Luna và stablecoin UST.Tòa án Seoul ban hành lệnh bắt giữ đối với CEO Terraform Labs Do Kwon và năm người khác để điều tra về thảm họa tiền số Luna.Theo văn phòng công tố tòa án Seoul ngày 14/9, có sáu người trong danh sách bắt giữ do vi phạm quy tắc thị trường vốn quốc gia. Hiện những người này được cho là đang ở Singapore, nơi Terraform Labs đặt trụ sở. Một nguồn tin cho biết, động thái trên nhằm làm sáng tỏ các vấn đề xung quanh sự sụp đổ của hai token trong hệ sinh thái Terra là Luna và stablecoin UST.Vào tháng 5, cộng đồng tiền số chứng kiến một trong những thảm họa lớn nhất lịch sử, khi cả đồng Luna và UST sụt giảm gần hết giá trị. Thông tin được trang Digital Today (Hàn Quốc) thu thập từ văn phòng Tòa án tối cao nước này cho thấy Terraform Labs quyết định giải thể chi nhánh Hàn Quốc sau cuộc họp hội đồng từ ngày 30/4. Đây được xem là hành động bất thường ngay trước khi sự cố Luna diễn ra."
            }
        ) {
            data {
                _id,
                title,
                description,
                content,
                thumbUrl,
            },
            error
        }
    }
  `

    const { data: { createNews: { data, error } } } = await Client.mutate({ mutation: createNews })
    expect(error.includes('Unauthorized')).toBeTruthy()
})

test('auth of Update news', async () => {
    const updateNews: any = gql`
    mutation {
        updateNews(
            _id: "6321b75c561b22566b3842a9",
            inputObject: { 
                title: "Người Nga tranh cãi về chiến dịch phản công của Ukraine 2",
            }
        ) {
            data,
            error
        }
    }
  `

    const { data: { updateNews: { data, error } } } = await Client.mutate({ mutation: updateNews })
    
    expect(error.includes('Unauthorized')).toBeTruthy()
})

test('auth of Delete news', async () => {
    const deleteNews: any = gql`
    mutation {
        deleteNews(_id: "6321b785561b22566b3842ad") {
            data,
            error
        }
    }
  `

    const { data: { deleteNews: { data, error } } } = await Client.mutate({ mutation: deleteNews })
    
    expect(error.includes('Unauthorized')).toBeTruthy()
})

test('get authed publisher news', async () => {
    const publisherNews: any = gql`
    query {
        getPublisherNews {
            data {
                _id,
                title,
                description,
                content,
                thumbUrl,
            },
            error
        }
    }
  `

    const { data: { getPublisherNews: { data, error } } } = await ClientAuthed.query({ query: publisherNews })
    
    expect(error).toBeFalsy()
    expect(data.length).toBeGreaterThan(0)
    expect(data.filter((e: { _id: string }) => e._id === '6321b75c561b22566b3842a9').length).toEqual(1)
})

test('test authed create news', async () => {
    const createNews: any = gql`
    mutation {
        createNews(
            inputObject: { 
                title: "Hàn Quốc phát lệnh bắt Do Kwon",
                thumbUrl: "https://i1-sohoa.vnecdn.net/2022/09/14/-5443-1663143219.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=SjcLj8aDIeqlvs4j73FCYQ",
                description: "Tòa án Seoul ban hành lệnh bắt giữ đối với CEO Terraform Labs Do Kwon và năm người khác để điều tra về thảm họa tiền số Luna."
                content: "Tòa án Seoul ban hành lệnh bắt giữ đối với CEO Terraform Labs Do Kwon và năm người khác để điều tra về thảm họa tiền số Luna.Theo văn phòng công tố tòa án Seoul ngày 14/9, có sáu người trong danh sách bắt giữ do vi phạm quy tắc thị trường vốn quốc gia. Hiện những người này được cho là đang ở Singapore, nơi Terraform Labs đặt trụ sở. Một nguồn tin cho biết, động thái trên nhằm làm sáng tỏ các vấn đề xung quanh sự sụp đổ của hai token trong hệ sinh thái Terra là Luna và stablecoin UST.Tòa án Seoul ban hành lệnh bắt giữ đối với CEO Terraform Labs Do Kwon và năm người khác để điều tra về thảm họa tiền số Luna.Theo văn phòng công tố tòa án Seoul ngày 14/9, có sáu người trong danh sách bắt giữ do vi phạm quy tắc thị trường vốn quốc gia. Hiện những người này được cho là đang ở Singapore, nơi Terraform Labs đặt trụ sở. Một nguồn tin cho biết, động thái trên nhằm làm sáng tỏ các vấn đề xung quanh sự sụp đổ của hai token trong hệ sinh thái Terra là Luna và stablecoin UST.Vào tháng 5, cộng đồng tiền số chứng kiến một trong những thảm họa lớn nhất lịch sử, khi cả đồng Luna và UST sụt giảm gần hết giá trị. Thông tin được trang Digital Today (Hàn Quốc) thu thập từ văn phòng Tòa án tối cao nước này cho thấy Terraform Labs quyết định giải thể chi nhánh Hàn Quốc sau cuộc họp hội đồng từ ngày 30/4. Đây được xem là hành động bất thường ngay trước khi sự cố Luna diễn ra."
            }
        ) {
            data {
                _id,
                title,
                description,
                content,
                thumbUrl,
            },
            error
        }
    }
  `

    const { data: { createNews: { data, error } } } = await ClientAuthed.mutate({ mutation: createNews })

    expect(error).toBeFalsy()
    expect(data).toBeTruthy()
})

test('test authed update news', async () => {
    const updateNews: any = gql`
    mutation {
        updateNews(
            _id: "6321b75c561b22566b3842a9",
            inputObject: { 
                title: "Người Nga tranh cãi về chiến dịch phản công của Ukraine 2",
            }
        ) {
            data,
            error
        }
    }
  `

    const { data: { updateNews: { data, error } } } = await ClientAuthed.mutate({ mutation: updateNews })
    
    expect(error).toBeFalsy()
    expect(data).toBeTruthy()
})

test('test authed update news', async () => {
    const deleteNews: any = gql`
    mutation {
        deleteNews(_id: "6321b785561b22566b3842ad") {
            data,
            error
        }
    }
  `

    const { data: { deleteNews: { data, error } } } = await ClientAuthed.mutate({ mutation: deleteNews })
    
    expect(error).toBeFalsy()
    expect(data).toBeTruthy()
})