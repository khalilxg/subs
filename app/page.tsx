import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,

} from '@/utils/supabase/queries';

export default async function PricingPage() {
  const supabase = createClient();
  const [ products] = await Promise.all([
    getProducts(supabase),
  ]);

  return (
    <Pricing
    />
  );
}
