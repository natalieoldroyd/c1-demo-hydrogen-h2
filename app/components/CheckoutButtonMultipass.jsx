export function CheckoutButtonMultipass({checkoutUrl}) {
  return (
    <form action="/account/login/multipass" method="post">
      <input type="hidden" value={checkoutUrl} name="checkoutUrl" />
      <button type="submit"> Checkout With Multipass</button>
    </form>
  );
}
