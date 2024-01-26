###
# Libs
###
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from app.combo.models.combo import Combo
from app.product.models.product import Product
from app.pricing.models.pricing import Pricing


###
# Signals
###
@receiver(post_save, sender=Product)
def update_combo_prices(sender, instance, **kwargs):
    combos_with_product = Combo.objects.filter(products=instance)

    for combo in combos_with_product:
        combo.price = combo.products.aggregate(total_price=models.Sum('price'))[
            'total_price'] or 0
        combo.save()


@receiver(post_save, sender=Product)
def update_pricing_on_product_update(sender, instance, **kwargs):
    pricings = Pricing.objects.filter(product=instance)

    for pricing in pricings:
        base_price = instance.price
        delivery_price = pricing.delivery_price if pricing.delivery_price else 0
        condominium = pricing.condominium if pricing.condominium else 0
        total_cost = base_price + delivery_price + condominium
        divisor = 1 - (pricing.tax/100 + pricing.card_tax/100 +
                       pricing.other/100 + pricing.profit/100)

        suggested_price = total_cost / divisor

        pricing.suggested_price = suggested_price
        pricing.save()
