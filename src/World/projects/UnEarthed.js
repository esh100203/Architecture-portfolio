export function buildUnEarthedPortal() {
  return `
    <div class="pp_header">
      <span class="pp_header_title">Journey to Destination</span>
      <button class="pp_back_btn">✕ Close</button>
    </div>
    <div class="pp_scroll">

      <!-- Hero -->
      <section class="ue_hero">
        <div class="ue_left_col">
          <div class="ue_top_block">
            <div class="ue_number">04</div>
            <div class="ue_meta">
              <div class="ue_meta_row">
                <span class="ue_meta_label">Site Location</span>
                <span class="ue_meta_value">Stone Quarry, Hampi, Karnataka</span>
              </div>
              <div class="ue_meta_row">
                <span class="ue_meta_label">Total Built Up</span>
                <span class="ue_meta_value">7600 sqm</span>
              </div>
            </div>
          </div>
          <div class="ue_desc_bottom">
            Inspired by the experience of bazaar streets, gopurams and mandapas, in Hampi, where discovery unfolds gradually, the design unfolds by inviting pauses and observation, framing the quarry as a lived memory.
          </div>
        </div>
        <div class="ue_right_col">
          <img loading="lazy" src="assets/projects/unearthed/thumbnail.jpg" alt="Journey to Destination" class="ue_hero_img" />
        </div>
      </section>

      <!-- Context text -->
      <div class="ue_context_text">
        <p>The quarry site lies between Hospet and Kamalapura, bordered by a state highway on one side and open farmland on the other. With a backdrop of exposed stone, dramatic contours, and a nearby canal feeding into a man-made lake, the landscape feels both raw and quietly immersive.</p>
        <p>Located within 5 km of the Virupaksha and Vittala temple complexes, the site offers both seclusion and contextual richness rooted in Hampi's layered history.</p>
        <p>This convergence of the historical, natural, and lived environments gives the site its unique richness.</p>
      </div>

      <!-- Iterations reel -->
      <section class="ue_reel_section" id="ue_reel_section">
        <div class="ue_reel_strip" id="ue_reel_strip">
          <img loading="lazy" src="assets/projects/unearthed/iterations-combined.jpg" class="ue_reel_img" loading="lazy" />
        </div>
      </section>

      <!-- Sketchup view + conceptss -->
      <div class="ue_sketch_section">
        <img loading="lazy" src="assets/projects/unearthed/sketchup-view.jpg" alt="Sketchup View" class="ue_sketch_img" />
        <div class="ue_concepts_col">
          <img loading="lazy" src="assets/projects/unearthed/conceptss.png" alt="Concepts" class="ue_conceptss_img" />
        </div>
      </div>

      <!-- Image 1 + text -->
      <div class="ue_img1_section">
        <img loading="lazy" src="assets/projects/unearthed/1.jpg" alt="View 1" class="ue_img1" />
        <div class="ue_img1_text">
          <p>The design blurs the line between built and landscape, allowing the form to emerge from the terrain. The building invites horizontal pauses and observation with vertical transitions. Shifts in floor plates respond to the contours, creating a dynamic rhythm of movement, compression, release and fragmented, shifting views of the quarry while transitioning between programmatic layers.</p>
          <p>Raised above ground, the form minimizes excavation, preserves rock formations, and reduces heat gain. Porous, layered blocks are shaped around voids that act as light wells, breezeways, and gathering spaces, becoming transitional zones where indoors and outdoors merge, guiding movement.</p>
          <p>Brick walls offer thermal insulation, passively cooling interiors while their earthy texture complements the rawness of the quarry terrain.</p>
        </div>
      </div>

      <!-- Plan + render 2 & 3 -->
      <div class="ue_plan_section">
        <img loading="lazy" src="assets/projects/unearthed/plan.png" alt="Plan" class="ue_plan_img"
          onload="(function(img){var r=document.querySelector('.ue_plan_renders');if(r)r.style.height=img.offsetHeight+'px';})(this)" />
        <div class="ue_plan_renders">
          <img loading="lazy" src="assets/projects/unearthed/render-2.jpg" alt="Render 2" class="ue_plan_render_img" />
          <img loading="lazy" src="assets/projects/unearthed/render-3.jpg" alt="Render 3" class="ue_plan_render_img" />
        </div>
      </div>

      <!-- Sections reel -->
      <section class="ue_sections_reel_section" id="ue_sections_reel_section">
        <div class="ue_sections_reel_strip" id="ue_sections_reel_strip">
          <img loading="lazy" src="assets/projects/unearthed/section-1.png" class="ue_section_img" loading="lazy" />
          <img loading="lazy" src="assets/projects/unearthed/section-2.png" class="ue_section_img" loading="lazy" />
          <img loading="lazy" src="assets/projects/unearthed/section-3.png" class="ue_section_img" loading="lazy" />
        </div>
      </section>

      <!-- Details -->
      <div class="ue_details_section">
        <div class="ue_detail_item">
          <img loading="lazy" src="assets/projects/unearthed/detail-1b.jpg" alt="Detail 1" class="ue_detail_img" />
          <span class="ue_detail_title">ETFE Cushion Panel</span>
        </div>
        <div class="ue_detail_item">
          <img loading="lazy" src="assets/projects/unearthed/detail-2b.jpg" alt="Detail 2" class="ue_detail_img" />
          <span class="ue_detail_title">Rock Auger Anchor Foundation</span>
        </div>
        <div class="ue_detail_item">
          <img loading="lazy" src="assets/projects/unearthed/detail-3b.jpg" alt="Detail 3" class="ue_detail_img" />
          <span class="ue_detail_title">Spin-Lock Anchor Foundation</span>
        </div>
      </div>

      <!-- Back to gallery -->
      <div class="tp_back_row">
        <button class="tp_back_btn pp_back_btn">Back to Gallery</button>
      </div>

    </div>
  `
}

