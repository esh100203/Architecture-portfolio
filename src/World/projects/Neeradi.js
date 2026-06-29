export function buildNeeradiPortal() {
  const img = (n) =>
    `<img loading="lazy" src="assets/projects/neeradi/paintings/${n}.jpg" alt="Painting ${n}" class="nr_reel_img" loading="lazy" />`

  const caption = (text) =>
    `<div class="nr_reel_caption"><p>${text}</p></div>`

  const reelContent = [
    caption('The series begins with the Hemavathi River at its most intense, as heavy monsoon swell its waters, caught in the raw energy of the storm. Capture the river\'s force and unpredictability, portraying both the drama of nature and human vulnerability.'),
    img(1), img(2), img(3), img(4), img(5),
    caption('As the rains subside, the river transforms into a scene of serenity. Explore the quiet interlude after the storm, where the river\'s calm signals the beginning of rituals and communal life.'),
    img(6), img(7), img(8),
    caption('In the summer months, Hemavathi becomes a space of human connection and celebration. Engage in rituals, temple festivities, and everyday recreation along its banks celebrating the intimate relationship between people and the river, shaping culture, leisure, and the rhythms of daily life.'),
    img(9), img(10),
  ].join('')

  return `
    <div class="pp_header">
      <span class="pp_header_title">Neeradi — The Water's Way</span>
      <button class="pp_back_btn">✕ Close</button>
    </div>
    <div class="pp_scroll">

      <!-- Section 1: Hero — left text panel, right full-bleed image -->
      <section class="nr_hero">
        <div class="nr_left_col">
          <div class="nr_top_block">
            <div class="nr_number">01</div>
            <div class="nr_meta">
              <div class="nr_meta_row">
                <span class="nr_meta_label">Site Location</span>
                <span class="nr_meta_value">Mavinakere, Hassan, Karnataka</span>
              </div>
              <div class="nr_meta_row">
                <span class="nr_meta_label">Total Built Up</span>
                <span class="nr_meta_value">5250 sqm</span>
              </div>
            </div>
          </div>
          <div class="nr_desc_bottom">
            Architecture being conceived not as a static object, but as a living extension of the river's rhythms by embracing adaptation, temporality and collective memory.
          </div>
        </div>
        <div class="nr_right_col">
          <img loading="lazy" src="assets/projects/neeradi/thumbnail2.jpeg" alt="Neeradi" class="nr_hero_img" />
        </div>
      </section>

      <!-- Section 1.5: Context text -->
      <div class="nr_context_text">
        <p>Neeradi emerges from the quiet longing of a landscape that once lived in intimate dialogue with the Hemavathi River. Historically, the Hemavathi River supported settlements along its banks due to fertile alluvial soil, seasonal floods and easy access to water. These settlements formed cultural ecosystems where the river held physical, visual and spiritual significance in daily life.</p>
        <p>This equilibrium was profoundly altered by the construction of the Gorur Dam in 1970s. The regulation and storage of water transformed the river's natural rhythms, replacing cyclical seasonal flooding with controlled releases and unpredictable man-made inundations.</p>
        <p>To understand this layered relationship, mappings and paintings were developed to read the river's changing terrain, seasonal water levels and emotional memory.</p>
      </div>

      <!-- Section 2: Paintings film reel -->
      <section class="nr_reel_section" id="nr_reel_section">
        <div class="nr_reel_holes nr_reel_holes_top"></div>
        <div class="nr_reel_strip" id="nr_reel_strip">
          ${reelContent}
        </div>
        <div class="nr_reel_holes nr_reel_holes_bottom"></div>
      </section>

      <!-- Section 3: Hemavathi map + analysis text -->
      <div class="nr_map_wrapper">
        <div class="nr_map_section">
          <div class="nr_map_image_col">
            <h3 class="nr_map_heading">Hemavathi River — Terrain and Floodplain Profile</h3>
            <img loading="lazy" src="assets/projects/neeradi/hemavathi-map.png" alt="Hemavathi Map" class="nr_map_img" />
          </div>
          <div class="nr_map_side_text">
            <p>These settlements weren't just functional but they were cultural ecosystems where the river held a visual, physical, and spiritual presence in everyday life.</p>
            <p>The construction of the Hemavathi dam altered this equilibrium. Its large reservoir demanded a re-engineering of the river's natural course, even cutting through or reshaping parts of the Western Ghats.</p>
            <p>Water, which once flowed freely, now became regulated and stored, distorting the natural ecosystem.</p>
            <p>As a result, man-made floods replaced natural ones, occurring unpredictably when water was released from the dam, submerging downstream settlements. This unpredictability led to the abandonment of settlements along the riverbanks, breaking the age-old pattern of riverine habitation.</p>
            <p>This transformed the identity of the river from once a source of life and stability, into a source triggering fear.</p>
            <p>Now, between Hemavathi and KRS dams, the entire river stretch shows no significant habitation which is a stark contradiction to historical patterns of rivers settlement.</p>
          </div>
        </div>
        <div class="nr_context_text nr_map_text">
          The documentation implies the need for adaptable and scalable systems that can transform with changing conditions, much like the community's own adaptive practices of reclaiming and releasing land with each flood. The river's edge is not a singular site but a network of interactions—ritual, ecology, and memory interwoven. Architectural implications thus move toward networked spatial systems, where small, dispersed, and interconnected interventions sustain the larger landscape narrative. Drawing from the cyclic nature of the river, structures are conceived to transform, disappear or re-emerge with seasonal shifts.
        </div>
      </div>

      <!-- Section 4: Renders grid -->
      <div class="nr_renders_grid">
        <div class="nr_renders_row">
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-1.png" alt="Render 1" />
            <span class="nr_render_label">Bell Mandapa</span>
          </div>
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-2.png" alt="Render 2" />
            <span class="nr_render_label">Theertotsava Mandapa</span>
          </div>
        </div>
        <div class="nr_renders_row">
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-3.png" alt="Render 3" class="nr_render_full" />
            <span class="nr_render_label">Top View — During Summer</span>
          </div>
        </div>
      </div>

      <!-- Section 5: Sections 1 bg full width -->
      <div class="nr_fullwidth_img">
        <img loading="lazy" src="assets/projects/neeradi/sections-1-bg.jpg" alt="Sections" />
      </div>

      <!-- Section 6: Mavinakere hydrology -->
      <div class="nr_mavinakere_section">
        <div class="nr_mavinakere_left">
          <h3 class="nr_mavinakere_heading">Mavinakere — Hydrology and Displacement</h3>
          <img loading="lazy" src="assets/projects/neeradi/mavinakere-hydrology.png" alt="Mavinakere Hydrology" class="nr_mavinakere_img" />
        </div>
        <div class="nr_mavinakere_right">
          <p class="nr_mavinakere_text">Mavinakere village, located along the Hemavathi River, is one of the communities displaced during the construction of the Hemavathi Dam in 1979. The relocation significantly altered the village's spatial and social fabric, though the local temple has remained an anchor point, sustaining cultural continuity and community identity. Historically dependent on the river for agriculture and daily needs, the village's interaction with the waterbody was drastically reshaped post-dam, with new settlements and altered access to water resources.</p>
        </div>
      </div>

      <!-- Section 7: Plan + Sections 2 -->
      <div class="nr_plan_sections_grid">
        <img loading="lazy" src="assets/projects/neeradi/plan.png" alt="Plan" class="nr_plan_img" />
        <div class="nr_plan_right_col">
          <div class="nr_plan_text">
            <p>A spiritual energy mapping traces the patterns of movement and gathering across different times of the day. The Temple, Market Space and Community Space emerged as primary nodes of activity, informing the placement of ancillary pavilions. Their locations were further refined through the site's terrain, hydrology, vegetation and visual connections, creating a framework that responds simultaneously to human activity, ecological systems and the cultural landscape.</p>
            <p>The design strategy draws from the understanding that permanence along the Hemavathi has always been an illusion. Here, architecture becomes an act of negotiation rather than control. Conceived as a constellation of pavilions, mandapas, markets, ghats and community spaces woven between the temple and the river, the intervention unfolds as a gradual journey through a landscape of thresholds. Programs emerge from the life of the village itself which included ritual gatherings, seasonal markets, statue offerings, communal celebrations, rest and observation. Movement through the site is shaped by seasonal water calendars, spiritual energy fields and collective memory, transforming the riverfront into a living archive of stories, rituals and return.</p>
          </div>
          <img loading="lazy" src="assets/projects/neeradi/sections 2b.jpg" alt="Sections 2" class="nr_sections2_img" />
        </div>
      </div>

      <!-- Section 8: Renders 4-7 -->
      <div class="nr_renders2_grid">
        <div class="nr_renders2_row">
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-4.png" alt="Render 4" />
            <span class="nr_render_label">Community Space — Summer Extension</span>
          </div>
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-5.png" alt="Render 5" />
            <span class="nr_render_label">Statue Pavilions — During Monsoon</span>
          </div>
        </div>
        <div class="nr_renders2_row">
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-6.png" alt="Render 6" />
            <span class="nr_render_label">Kalyana Mandapa</span>
          </div>
          <div class="nr_render_cell">
            <img loading="lazy" src="assets/projects/neeradi/render-7.png" alt="Render 7" />
            <span class="nr_render_label">Santhe Space</span>
          </div>
        </div>
      </div>

      <!-- Section 9: Details -->
      <div class="nr_details_section">
        <div class="nr_detail_cell">
          <img loading="lazy" src="assets/projects/neeradi/detail-2.png" alt="Detail 2" class="nr_detail_img" />
        </div>
        <div class="nr_detail_right_group">
          <div class="nr_detail_text">
            <p>Shaped by cyclical patterns of pilgrimage, trade, and seasonal rituals, it expandes during festivals and contracting during quieter periods. Rather than being defined by permanent density, its character emerges through temporal occupation, where pathways and open grounds shift between civic, commercial and sacred. Their placement is guided by hydrology, terrain and patterns of occupation, creating a network of encounters that reconnect people with both the sacred presence of the temple and the changing edge of the river.</p>
            <p>Neeradi imagines the river edge as a shared terrain permanence and impermanence, memory and anticipation continuously meet. An architecture that does not stand against the river, but listens to it.</p>
          </div>
          <div class="nr_detail_imgs_row">
            <div class="nr_detail_cell">
              <img loading="lazy" src="assets/projects/neeradi/detail-3.png" alt="Detail 3" class="nr_detail_img" />
            </div>
            <div class="nr_detail_cell">
              <img loading="lazy" src="assets/projects/neeradi/detail-1.png" alt="Detail 1" class="nr_detail_img" />
            </div>
          </div>
        </div>
      </div>

      <!-- Back to gallery -->
      <div class="nr_back_row">
        <button class="nr_back_btn pp_back_btn">Back to Gallery</button>
      </div>

    </div>
  `
}

