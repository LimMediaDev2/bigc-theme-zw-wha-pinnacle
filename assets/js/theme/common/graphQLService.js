/**
 * IntuitSolutions.net - Interval Quantity
 * LimMedia.io
 */
class GraphqlService {
    constructor(baseUrl = '/graphql') {
        this.baseUrl = baseUrl;
    }
    base(queryString, storeFrontToken) {
        const httpHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storeFrontToken}`
        };
        const headers = new Headers(httpHeaders);

        return new Promise((resolve, reject) => {
            fetch(this.baseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({ query: queryString })
            })
                .then((res) => {
                    if (res.status === 400) return reject();
                    return res.json();
                })
                .then((result) => {
                    const { data, error } = result;
                    if (data) return resolve(data);
                    return reject(error);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    request(query, storeFrontToken) {
        return this.base(query, storeFrontToken);
    }
}

const graphqlService = new GraphqlService();

/**
 * @param {String} methodName internal method to call
 * @param {String} sfToken storefront token for graphQL queries
 * @param {String} queryFields specific query's fields
 * @returns {Promise} graphQL query response promise
*/
const getDataFromGraphql = ( methodName, sfToken, queryFields ) => {
    if(!methodName || !sfToken)
        return null;
    if(methodName == 'getProductData'){
        return getProductData(queryFields.id, queryFields.fields, sfToken);
    }
    else return null;
};

const getProductData = (id, fields, token) => {
    const query = `query GetProductData {
        site {
          product (entityId: ${id}) {
            ${fields}
          }
        }
    }`;
    return new Promise((resolve, reject) => {
        graphqlService.request(query, token).then((result) => resolve(result.site.product)).catch((error) => reject(error));
    });
};

export {
    getDataFromGraphql,
};
