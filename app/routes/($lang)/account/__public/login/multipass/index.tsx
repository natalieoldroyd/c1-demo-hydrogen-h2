import {Multipassify} from '~/lib/multipassify';
import {redirect, ActionFunction} from '@shopify/remix-oxygen';

const CUSTOMER_INFO_QUERY = `#graphql
  query CustomerInfo($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      acceptsMarketing
  }
  }
`;

/*
/login/multipass

  Generates a multipass token for a given customer and return_to url.
  Handles POST `/account/login/multipass` requests.
  expects body: { return_to?: string, customer }
*/

export const action: ActionFunction = async ({request, context}) => {
  const formData = await request.formData();
  const session = context.session;
  const storefront = context.storefront;
  const customerAccessToken = session.get('customerAccessToken');
  const multipassSecret = context.env.SHOPIFY_STORE_MULTIPASS_SECRET;
  const checkoutDomain = context.env.SHOPIFY_CHECKOUT_DOMAIN;

  const data = await storefront.query(CUSTOMER_INFO_QUERY, {
    variables: {
      customerAccessToken,
    },
  });

  const checkoutUrl = formData.get('checkoutUrl');
  const customer = data.customer;

  try {
    // create new multipassify instance
    const multipassify = new Multipassify(
      // @ts-ignore
      multipassSecret,
    );

    // customer info to be encoded in the token, only email and created_at are required
    const customerInfo = {
      email: customer.email,
      first_name: customer.firstName,
      created_at: new Date().toISOString(),
      return_to: checkoutUrl,

      // can update query to get addreses for customer but even then cannot use this to populate the checkout form on arrival
      // addresses: customerInfo.addresses[0].node.addresses[0],
    };

    // Generating a token for customer
    const dataMultipass = multipassify.generate(
      customerInfo,
      // @ts-ignore
      checkoutDomain,
      request,
    );
    return redirect(dataMultipass.url);
  } catch (error) {
    console.log('error');
  }

  return data;
};
